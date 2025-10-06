import Foundation

struct Product: Identifiable, Codable {
    let id: Int
    let name: String
    let price: Double
    let image: String
    let category: String?
    let description: String?
}
