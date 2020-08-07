package me.shellbin;

import com.googlecode.lanterna.TerminalPosition;
import com.googlecode.lanterna.TerminalSize;
import com.googlecode.lanterna.gui2.*;
import com.googlecode.lanterna.input.KeyStroke;
import com.googlecode.lanterna.input.KeyType;
import com.googlecode.lanterna.screen.Screen;
import com.googlecode.lanterna.screen.TerminalScreen;
import com.googlecode.lanterna.terminal.ansi.TelnetTerminal;
import com.googlecode.lanterna.terminal.ansi.TelnetTerminalServer;

import java.io.*;
import java.net.SocketException;
import java.util.ArrayList;
import java.util.List;

public class telnetServer {
    public static final int PORT = 23;

    public static void main(String[] args) throws IOException {
        TelnetTerminalServer telnetTerminalServer = new TelnetTerminalServer(PORT);
        System.out.println("TelnetServer is linsting port " + PORT);

        while(true) {
            final TelnetTerminal telnetTerminal = telnetTerminalServer.acceptConnection();
            System.out.println(telnetTerminal.getRemoteSocketAddress() + " connected server!");
            Thread thread = new Thread(() -> {
                try {
                    runGUI(telnetTerminal);
                }
                catch (IOException e) {
                    e.printStackTrace();
                }
                try {
                    telnetTerminal.close();
                }
                catch (IOException ignore) {}
            });
            thread.start();
        }
    }

    private static final List<TextBox> ALL_TEXTBOXES = new ArrayList<>();

    @SuppressWarnings({"rawtypes"})
    private static void runGUI(final TelnetTerminal telnetTerminal) throws IOException {
        Screen screen = new TerminalScreen(telnetTerminal);
        screen.startScreen();
        final MultiWindowTextGUI textGUI = new MultiWindowTextGUI(screen);
        textGUI.setBlockingIO(false);
        textGUI.setEOFWhenNoWindows(true);
        try {
            final BasicWindow window = new BasicWindow("Text GUI over Telnet");
            Panel contentArea = new Panel();
            contentArea.setLayoutManager(new LinearLayout(Direction.VERTICAL));
            contentArea.addComponent(new Button("Button", () -> {
                final BasicWindow messageBox = new BasicWindow("Response");
                messageBox.setComponent(Panels.vertical(
                        new Label("Hello!"),
                        new Button("Close", messageBox::close)));
                textGUI.addWindow(messageBox);
            }).withBorder(Borders.singleLine("This is a button")));


            final TextBox textBox = new TextBox(new TerminalSize(20, 4)) {
                @Override
                public Result handleKeyStroke(KeyStroke keyStroke) {
                    try {
                        return super.handleKeyStroke(keyStroke);
                    }
                    finally {
                        for(TextBox box: ALL_TEXTBOXES) {
                            if(this != box) {
                                box.setText(getText());
                            }
                        }
                    }
                }
            };
            ALL_TEXTBOXES.add(textBox);
            contentArea.addComponent(textBox.withBorder(Borders.singleLine("Text editor")));
            contentArea.addComponent(new AbstractInteractableComponent() {
                String text = "Press any key";
                @Override
                protected InteractableRenderer createDefaultRenderer() {
                    return new InteractableRenderer() {
                        @Override
                        public TerminalSize getPreferredSize(Component component) {
                            return new TerminalSize(72, 1);
                        }

                        @Override
                        public void drawComponent(TextGUIGraphics graphics, Component component) {
                            graphics.putString(0, 0, text);
                        }

                        @Override
                        public TerminalPosition getCursorLocation(Component component) {
                            return TerminalPosition.TOP_LEFT_CORNER;
                        }
                    };
                }

                @Override
                public Result handleKeyStroke(KeyStroke keyStroke) {
                    if(keyStroke.getKeyType() == KeyType.Tab ||
                            keyStroke.getKeyType() == KeyType.ReverseTab) {
                        return super.handleKeyStroke(keyStroke);
                    }
                    if(keyStroke.getKeyType() == KeyType.Character) {
                        text = "Character: " + keyStroke.getCharacter() + (keyStroke.isCtrlDown() ? " (ctrl)" : "") +
                                (keyStroke.isAltDown() ? " (alt)" : "");
                    }
                    else {
                        text = "Key: " + keyStroke.getKeyType() + (keyStroke.isCtrlDown() ? " (ctrl)" : "") +
                                (keyStroke.isAltDown() ? " (alt)" : "");
                    }
                    return Interactable.Result.HANDLED;
                }
            }.withBorder(Borders.singleLine("Custom component")));

            contentArea.addComponent(new Button("Close", window::close));
            window.setComponent(contentArea);

            textGUI.addWindowAndWait(window);
        }
        finally {
            try {
                screen.stopScreen();
            }
            catch (SocketException ignore) {
                // If the telnet client suddenly quit, we'll get an exception when we try to get the client to exit
                // private mode, but that's fine, no need to report this
            }
        }
    }
}
