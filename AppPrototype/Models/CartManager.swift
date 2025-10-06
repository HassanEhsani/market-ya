import SwiftUI
import Foundation
import Combine

class CartManager: ObservableObject {
    @Published var products: [Product] = []

    var total: Double {
        products.reduce(0) { $0 + $1.price }
    }

    func addToCart(product: Product) {
        products.append(product)
    }

    func removeFromCart(atOffsets offsets: IndexSet) {
        products.remove(atOffsets: offsets)
    }
}
