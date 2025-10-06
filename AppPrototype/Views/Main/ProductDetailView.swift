import SwiftUI

struct ProductDetailView: View {
    let product: Product
    @EnvironmentObject var cart: CartManager

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                Image(systemName: product.imageName)
                    .resizable()
                    .scaledToFit()
                    .frame(height: 150)
                    .foregroundColor(.blue)

                Text(product.title)
                    .font(.title)
                    .multilineTextAlignment(.center)

                Text("$\(product.price, specifier: "%.2f")")
                    .font(.title2)
                    .foregroundColor(.gray)

                Text("Category: \(product.category)")
                    .font(.subheadline)
                    .foregroundColor(.secondary)

                Button("Buy Now") {
                    cart.addToCart(product: product)
                }
                .buttonStyle(.borderedProminent)
            }
            .padding()
        }
        .navigationTitle("Product Details")
    }
}
