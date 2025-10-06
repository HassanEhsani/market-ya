import SwiftUI
import Combine

class CartManager: ObservableObject {
    @Published var products: [Product] = []

    var total: Double {
        products.reduce(0) { $0 + $1.price }
    }

    func addToCart(product: Product) {
        products.append(product)
    }

    func removeFromCart(index: Int) {
        guard products.indices.contains(index) else { return }
        products.remove(at: index)
    }

    func clearCart() {
        products.removeAll()
    }
}
