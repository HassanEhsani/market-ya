import SwiftUI

@main
struct AppPrototypeApp: App {
    @StateObject var cart = CartManager()

    var body: some Scene {
        WindowGroup {
            HomeView()
                .environmentObject(cart)
        }
    }
}
