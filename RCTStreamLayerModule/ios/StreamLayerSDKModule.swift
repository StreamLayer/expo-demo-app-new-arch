//
//  StreamLayerModule.swift
//  SLExpoDemoNewArch
//
//  Created by Иосиф Яковлев on 30.11.2024.
//

import Foundation
import React
import StreamLayerSDK
import OSLog
import UIKit



@objc
public class StreamLayerSDKModule: NSObject {

    private var logger = Logger(subsystem: "StreamLayerSDKModule", category: "SDK")

 


  @objc(initSdk:resolver:rejecter:)
    public func initSdk(config: NSDictionary?, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
      logger.log(level: .debug, "setup started")
      guard let config = config, config.count > 0 else { return }
      let slConfiguration = StreamLayerConfiguration.fromDictionary(config)

      StreamLayer.config.triviaBalanceButtonVerticalCustomPadding = UIEdgeInsets(top: 10, left: 20, bottom: 0, right: 20)
      StreamLayer.config.triviaBalanceButtonHorizontalCustomPadding = UIEdgeInsets(top: 21, left: 17, bottom: 0, right: 34)
      if(!StreamLayer.isInitialized()) {
          StreamLayer.initSDK(with: slConfiguration.sdkKey,
                              isDebug: true,
                              delegate: self,
                              loggerDelegate: self)
      }

      StreamLayer.config.appStyle = .blue
      StreamLayer.config.wpStatusViewTopOffset = -12.0
      StreamLayer.config.pullDownTooltipTopOffset = 60.0
      StreamLayer.config.gamificationOptions = SLRGamificationOptions(globalLeaderBoardEnabled: slConfiguration.isGlobalLeaderboardEnabled, invitesEnabled: slConfiguration.isGamesInviteEnabled)

      logger.log(level: .debug, "setup completed")

      resolve(())
  }


    // MARK: - Create Event Session
    @objc(createEventSession:resolver:rejecter:)
    public func createEventSession(eventId: String, resolver resolve: @escaping (Bool) -> Void, rejecter reject: @escaping (NSString, NSString) -> Void) {
        _ = StreamLayer.createSession(for: eventId)
        resolve(true)
    }

    @objc(releaseEventSession:rejecter:)
    public func releaseEventSession(resolver resolve: @escaping (Bool) -> Void, rejecter reject: @escaping (NSString, NSString) -> Void) {
        resolve(true)
    }
    // MARK: - Logout
    @objc
    public func logout() {
        StreamLayer.logout()
    }

  // Deep links handler
  @objc(handleDeepLink:resolver:rejecter:)
    public func handleDeepLink(params: NSDictionary,
                      resolver resolve: @escaping (Bool) -> Void,
                      rejecter reject: @escaping (NSString, NSString) -> Void) {

      // Преобразуем `params` в [String: AnyObject]
      guard let paramsDict = params as? [String: AnyObject] else {
          reject("Error", "Invalid parameters")
          return
      }

      DispatchQueue.main.async {
          let success = StreamLayer.handleDeepLink(params: paramsDict)
          resolve(success)
      }
  }

  // Authorization Bypass
  @objc(authorizationBypass:token:resolver:rejecter:)
    public func authorizationBypass(schema: String,
                           token: String,
                           resolve: @escaping ([[String: String]]) -> Void,
                           reject: @escaping (String, String, Error) -> Void
  ) -> Void {
      // Локальные переменные для резолвера и реджектора
      let localResolver = resolve
      let localRejecter = reject

      Task {
          do {
              try await StreamLayer.setAuthorizationBypass(token: token, schema: schema)
//              localResolver(())
          } catch {
              localRejecter("", error.localizedDescription, error)
          }
      }
  }

  // Use Anonymous Auth
  @objc(useAnonymousAuth:reject:)
    public func useAnonymousAuth(resolve: @escaping ([[String: String]]) -> Void, reject: @escaping (String, String, Error) -> Void ) -> Void {
      // Локальные переменные для резолвера и реджектора
      let localResolver = resolve
      let localRejecter = reject

      Task {
          do {
              try await StreamLayer.useAnonymousAuth()
//              localResolver(())
          } catch {
              localRejecter("", error.localizedDescription, error)
          }
      }
  }

    // MARK: - Is User Authorized
    @objc
    public func isUserAuthorized() -> Bool {
        return StreamLayer.isUserAuthorized()
    }
    
    // MARK: - Is Initialized
    @objc
    public func isInitialized() -> Bool {
        return StreamLayer.isInitialized()
    }

    // MARK: - removeOverlay


  // MARK: - Remove Overlay
    @objc
    public func removeOverlay() {
        StreamLayer.removeOverlay()
    }

    // MARK: - Invites

   @objc(getInvite:resolver:rejecter:)
   public func getInvite(json: NSDictionary,
                  resolver resolve: RCTPromiseResolveBlock,
                  rejecter reject: RCTPromiseRejectBlock) -> Void {
       guard let opts = json as? [String: AnyObject],
             let associatedData = opts["streamlayer"] as? [String: Any],
             let data: SLRInviteLinkData = associatedData.object()
       else {
         return resolve(nil)
       }
       resolve(encodeToDictionary(data))
   }



//  @objc(getDemoEvents:resolve:reject:)
//  func getDemoEvents(date: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
//      if !date.isEmpty {
//          UserDefaults.standard.setValue(date, forKey: "EventsDemoDate")
//      }
//      
//      let semaphore = DispatchSemaphore(value: 0)
//      var resultStreams: [StreamLayer.SLRStreamModel] = []
//      var resultError: Error?
//      
//      StreamLayer.shared.requestDemoStreams(showAllStreams: true) { error, streams in
//          resultStreams = streams
//          resultError = error
//          semaphore.signal()
//      }
//      
//      semaphore.wait()
//      
//      if let error = resultError {
//          reject("", error.localizedDescription, error)
//          return
//      }
//      
//      let data = resultStreams.map { $0.toDict() }
//      resolve(data)
//  }

  
  @objc(getDemoEvents:resolve:reject:)
    public func getDemoEvents(date: String, resolve: @escaping ([[String: String]]) -> Void, reject: @escaping (String, String, Error) -> Void ) -> Void {
        if !date.isEmpty{
            UserDefaults.standard.setValue(date, forKey: "EventsDemoDate")
        }
        StreamLayer.shared.requestDemoStreams(showAllStreams: true) { error, streams in
            if let error = error {
              reject("", error.localizedDescription, error)
              return
            }
          
            let data = streams.map { $0.toDict() }
            resolve(data)
        }
      }



}

extension StreamLayer.SLRStreamModel {

    func toDict() -> [String: String] {
        return [
            "id": "\(eventId)",
            "title": titleText,
            "subtitle": subtitle,
            "previewUrl": preview,
            "videoUrl": streamURL
        ]
    }
}

// MARK: - StreamLayerDelegate

extension StreamLayerSDKModule: StreamLayerDelegate {
  public func inviteHandled(invite: SLRInviteData, completion: @escaping (Bool) -> Void) {
    completion(false)
  }

  public func requireAuthentication(nameInputOptions: StreamLayer.Auth.SLRRequireAuthOptions, completion: @escaping (Bool) -> Void) {
    guard let vc = UIApplication.shared.topWindow?.topViewController else { return }

    let provider = StreamLayerProvider()
    let authFlow = SLRAuthFlow(authProvider: provider)

    authFlow.show(from: vc, options: nameInputOptions) { error in
      completion(error != nil)
    }
  }
}

// MARK: - SLROverlayLoggerDelegate

extension StreamLayerSDKModule: SLROverlayLoggerDelegate {

  public func sendLogdata(userInfo: String) {
    logger.log(level: .debug, "\(userInfo)")
  }

  public func receiveLogs(userInfo: String) {
    logger.log(level: .debug, "\(userInfo)")
  }
}

extension UIWindow {
  var topViewController: UIViewController? {
    var topMostViewController = self.rootViewController
    while let presentedViewController = topMostViewController?.presentedViewController {
      topMostViewController = presentedViewController
    }
    return topMostViewController
  }
}


extension UIApplication {

    var topWindow: UIWindow? {
        return UIApplication.shared.connectedScenes
            .filter { $0.activationState == .foregroundActive }
            .first(where: { $0 is UIWindowScene })
            .flatMap({ $0 as? UIWindowScene })?.windows
            .first(where: \.isKeyWindow)
    }

}
