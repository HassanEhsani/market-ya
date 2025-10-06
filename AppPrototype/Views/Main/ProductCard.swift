import SwiftUI

struct ProductCard: View {
    let product: Product

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // اگر تصویر از API به صورت URL یا Base64 باشه، بعداً اینجا می‌ذاریم
            Rectangle()
                .fill(Color.gray.opacity(0.3))
                .frame(height: 120)
                .cornerRadius(8)

            Text(product.name)
                .font(.headline)
                .lineLimit(1)

            Text("₽ \(Int(product.price))")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color.white)
        .cornerRadius(12)
        .shadow(radius: 2)
    }
}
