import SwiftUI

struct MainAppView: View {
    var body: some View {
        TabView {
            HomeTab()
                .tabItem {
                    Label("خانه", systemImage: "house")
                }

            CategoriesTab()
                .tabItem {
                    Label("دسته‌بندی‌ها", systemImage: "square.grid.2x2")
                }

            ProfileTab()
                .tabItem {
                    Label("پروفایل", systemImage: "person.circle")
                }
        }
    }
}
