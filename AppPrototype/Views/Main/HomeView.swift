import SwiftUI

struct HomeView: View {
    @StateObject private var service = ProductService()

    var body: some View {
        NavigationView {
            ScrollView {
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 160))], spacing: 16) {
                    ForEach(service.products) { product in
                        ProductCard(product: product)
                    }
                }
                .padding()
            }
            .navigationTitle("🛍️ محصولات")
            .onAppear {
                service.fetchProducts()
            }
        }
    }
}
