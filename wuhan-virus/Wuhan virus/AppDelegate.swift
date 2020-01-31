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
            button.title = "hello"
            getData()
            
        }
    }

    func applicationWillTerminate(_ aNotification: Notification) {

    }
    
    static var minions:[Minion] = [] {
        didSet {
            NSNotificationCenter.defaultCenter().postNotificationName("minionsFetched", object: nil)
       }
    }
    
    func getData() -> String {
        let url = URL(string: "https://3g.dxy.cn/newh5/view/pneumonia")!

        let task = URLSession.shared.dataTask(with: url) {(data, response, error) in
            guard let data = data else { return }
            let httpData = (String(data: data, encoding: .utf8)!)
            print (httpData)
            
            let regex = try! NSRegularExpression(pattern: "<script id=\"getAreaStat\">(.*)</script>", options: NSRegularExpression.Options.caseInsensitive)
            let textData = regex.matches(in: httpData, options: [], range: NSRange(location: 0, length: httpData.count))
            
            if let match = textData.first {
                let range = match.range(at:1)
                if let swiftRange = Range(range, in: httpData) {
                    let xml = httpData[swiftRange]
                    return String(xml)
                }
            }
        }
        task.resume()
    }
}
