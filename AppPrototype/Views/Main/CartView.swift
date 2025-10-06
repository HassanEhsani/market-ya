import SwiftUI

struct CartView: View {
    @EnvironmentObject var cart: CartManager

    var body: some View {
        VStack {
            if cart.products.isEmpty {
                Spacer()
                Text("🛒 Your cart is empty")
                    .font(.title2)
                    .foregroundColor(.gray)
                Spacer()
            } else {
                List {
                    ForEach(cart.products) { product in
                        HStack {
                            Text(product.title)
                            Spacer()
                            Text("$\(product.price, specifier: "%.2f")")
                        }
                    }
                    .onDelete { indexSet in
                        cart.products.remove(atOffsets: indexSet)
                    }
                }
                .listStyle(.plain)

                Text("Total: $\(cart.total, specifier: "%.2f")")
                    .font(.headline)
                    .padding()

                Button("Checkout") {
                    print("Proceeding to checkout")
                }
                .buttonStyle(.borderedProminent)
                .padding()
            }
        }
        .navigationTitle("Cart")
    }
}
