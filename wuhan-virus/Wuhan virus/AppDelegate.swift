//
//  AppDelegate.swift
//  Wuhan virus
//
//  Created by ShellBin on 2020/1/29.
//  Copyright © 2020 ShellBin. All rights reserved.
//

import Cocoa
import SwiftUI

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
    
    let statusItem = NSStatusBar.system.statusItem(withLength: 150)


    func applicationDidFinishLaunching(_ aNotification: Notification) {
        if let button = statusItem.button {
            button.title = getData();
        }
    }

    func applicationWillTerminate(_ aNotification: Notification) {

    }
    
    
    func getData() -> String {
        let url = URL(string: "https://3g.dxy.cn/newh5/view/pneumonia")!

        let task = URLSession.shared.dataTask(with: url) {(data, response, error) in
            guard let data = data else { return }
            return (String(data: data, encoding: .utf8)!)
        }
        task.resume()
    }


}
