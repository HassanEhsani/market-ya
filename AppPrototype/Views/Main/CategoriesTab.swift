import SwiftUI

struct CategoriesTab: View {
    var body: some View {
        List {
            Text("الکترونیک")
            Text("پوشاک")
            Text("کتاب‌ها")
            Text("خانه و آشپزخانه")
        }
        .navigationTitle("دسته‌بندی‌ها")
    }
}
