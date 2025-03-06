//
//  StreamLayerRTCViewManager.swift
//  react-native-streamlayer
//
//  Created by Kirill Kunst on 10.05.2024.
//


import Foundation
import React
import StreamLayerSDK

@objcMembers 
 public class StreamLayerRCTViewManager: NSObject {
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc 
   public func createView(emitterDelegate: RCTStreamLayerEmitterProtocol) -> UIView {
    let uiView = StreamLayerWrapperView()
    uiView.emitterDelegate = emitterDelegate
    return uiView
  }

  // Обработчики команд (например, скрытие меню, показ оверлея)
  @objc 
     public func hideMenu(args: NSDictionary, promise: @escaping (Any?, Error?) -> Void) {
      DispatchQueue.main.async {
          // Логика для скрытия меню
          StreamLayer.hideLaunchButton(true)
          StreamLayer.hideLaunchControls(true)
          promise(nil, nil)
      }
  }

  @objc 
     public func hideOverlay(args: NSDictionary, promise: @escaping (Any?, Error?) -> Void) {
      DispatchQueue.main.async {
          StreamLayer.closeCurrentOverlay()
          promise(nil, nil)
      }
  }

  @objc 
     public func showOverlay(args: NSString, promise: @escaping (Any?, Error?) -> Void) {
      DispatchQueue.main.async {
          guard let overlayType = StreamLayerShowOverlayMapper.map(String(args)) else {
              promise(nil, NSError(domain: "StreamLayerViewManager", code: 400, userInfo: ["message": "Invalid overlay type"]))
              return
          }
          try? StreamLayer.showOverlay(overlayType: overlayType, mainContainerViewController: UIViewController())
          promise(nil, nil)
      }
  }

  @objc 
     public func handleInvite(args: NSDictionary, promise: @escaping (Any?, Error?) -> Void) {
      guard let opts = args as? [String: AnyObject], let data: SLRInviteLinkData = opts.object() else {
          promise(nil, NSError(domain: "StreamLayerViewManager", code: 400, userInfo: ["message": "Invalid invite data"]))
          return
      }
      DispatchQueue.main.async {
          let params = ["streamlayer": encodeToDictionary(data)]
          _ = StreamLayer.handleDeepLink(params: params as [AnyHashable : Any])
          promise(nil, nil)
      }
  }
}


