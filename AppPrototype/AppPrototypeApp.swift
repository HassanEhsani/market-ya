import SwiftUI

@main
struct AppPrototypeApp: App {
    @StateObject private var cart = CartManager()

    var body: some Scene {
        WindowGroup {
            HomeView()
                .environmentObject(cart)
        }
    }
}
