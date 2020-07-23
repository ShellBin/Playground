package me.shellbin;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class telnetServer {

    public static final int PORT = 23;
    private ServerSocket serverSocket = null;
    private ExecutorService executorService = null;
    private final int Thread_POOL_SIZE = 3;

    public telnetServer() throws Exception {
        //打印服务器情况
        Runtime serverRuntime = Runtime.getRuntime();
        int availableCPU = serverRuntime.availableProcessors();
        executorService = Executors.newFixedThreadPool(availableCPU * Thread_POOL_SIZE);
        serverSocket = new ServerSocket(PORT);
        System.out.println("Server Started with " + availableCPU +" CPUs and " + availableCPU * Thread_POOL_SIZE +" Threads");
        System.out.println("JVM Max RAM: " + serverRuntime.maxMemory() / (1024 * 1024)+ "MB, Free RAM: " + serverRuntime.freeMemory()/ (1024 * 1024)+ "MB");
        System.out.println("Waiting for client...");

        //等待服务器被连接
        while(true){
            try{
                Socket socket = serverSocket.accept();
                executorService.execute(new Responser(socket));
            }catch(Exception e){
                e.printStackTrace();
            }
        }
    }

    class Responser implements  Runnable {
        private Socket socket = null;
        public Responser(Socket socket) {
            this.socket = socket;
        }

        public void run() {
            try{
                String clientIP = socket.getInetAddress().getHostAddress();
                System.out.println("User " + clientIP + ":" + socket.getPort() + " Connected\r\n");
                InputStream socketInStream = socket.getInputStream();
                BufferedReader br = new BufferedReader(new InputStreamReader(socketInStream, "UTF-8"));
                OutputStream socketOutStream = socket.getOutputStream();

                socketOutStream.write(("Shell>").getBytes("GBK"));
                String clientRequestString = null;
                while((clientRequestString = br.readLine()) != null){
                    System.out.println(clientIP + ": " + clientRequestString);
                    String serverReturn = null;
                    if(clientRequestString.equals("quit")){
                        serverReturn = "断开连接.\r\n";
                        System.out.println("发送给客户端" + clientIP + "应答信息:" + serverReturn);
                        socketOutStream.write(serverReturn.getBytes("GBK"));
                        System.out.println("结束来自 " + clientIP + ":" + socket.getPort() + " 的请求");
                        break;
                    }else{
                        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss E");
                        serverReturn = df.format(new Date()) + "\r\n";
                        System.out.println("发送给客户端 " + clientIP + "应答信息:" + serverReturn);
                        socketOutStream.write((serverReturn+"\r\nShell>").getBytes("GBK"));
                    }
                }

            }catch(Exception e){
                e.printStackTrace();
            }finally{
                try {
                    if(socket != null){
                        socket.close();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public static void main(String[] args) throws Exception {
        new telnetServer();
    }
}
