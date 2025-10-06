import SwiftUI

struct ProductDetailView: View {
    let product: Product
    @EnvironmentObject var cart: CartManager

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                Image(product.image) // اگر image اسم فایل محلیه
                    .resizable()
                    .scaledToFit()
                    .frame(height: 300)
                    .cornerRadius(10)
                    .padding()
                    .background(Color.blue.opacity(0.1))

                Text(product.name) // اصلاح شده از title → name
                    .font(.title)
                    .fontWeight(.semibold)
                    .multilineTextAlignment(.center)

                Text("$\(product.price, specifier: "%.2f")")
                    .font(.title2)

                if let category = product.category {
                    Text("Category: \(category)")
                        .foregroundColor(.gray)
                }

                if let description = product.description {
                    Text(description)
                        .padding(.horizontal)
                }

                Button("Add to Cart") {
                    cart.addToCart(product: product)
                }
                .buttonStyle(.borderedProminent)
                .padding(.top)
            }
            .padding()
        }
        .navigationTitle("Product Details")
    }
}
