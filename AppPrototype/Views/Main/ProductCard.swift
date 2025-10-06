import SwiftUI

struct ProductCard: View {
    let product: Product
    @EnvironmentObject var cart: CartManager

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            NavigationLink(destination: ProductDetailView(product: product)) {
                Image(systemName: product.imageName)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 180, height: 180)
                    .cornerRadius(10)
                    .shadow(radius: 5)
                    .foregroundColor(.blue)
            }

            Text(product.title)
                .font(.headline)
                .multilineTextAlignment(.center)

            Text("$\(product.price, specifier: "%.2f")")
                .font(.caption)
                .foregroundColor(.gray)

            HStack {
                Button("Buy!") {
                    print("Buying \(product.title)")
                }
                .buttonStyle(.borderedProminent)

                Button("Add to Cart") {
                    cart.addToCart(product: product)
                }
                .buttonStyle(.bordered)
            }
        }
        .padding()
        .background(Color.white)
        .cornerRadius(20)
        .shadow(radius: 10)
    }
}
