import SwiftUI

struct HomeView: View {
    @EnvironmentObject var cart: CartManager

    var body: some View {
        NavigationView {
            ScrollView {
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 150))], spacing: 20) {
                    ForEach(sampleProducts) { product in
                        ProductCard(product: product)
                            .environmentObject(cart)
                    }
                }
                .padding()
            }
            .navigationTitle("🛍️ Categories")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    NavigationLink(destination: CartView()) {
                        Image(systemName: "cart")
                    }
                }
            }
        }
    }
}
