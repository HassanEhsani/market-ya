import SwiftUI

struct HomeTab: View {
    var body: some View {
        VStack(spacing: 20) {
            Text("خوش آمدید 👋")
                .font(.title)
                .fontWeight(.bold)

            Image(systemName: "sparkles")
                .resizable()
                .frame(width: 80, height: 80)
                .foregroundColor(.blue)

            Text("اینجا صفحه اصلی شماست.")
                .foregroundColor(.gray)
        }
        .padding()
    }
}
