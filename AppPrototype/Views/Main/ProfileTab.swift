import SwiftUI

struct ProfileTab: View {
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "person.crop.circle.fill")
                .resizable()
                .frame(width: 100, height: 100)
                .foregroundColor(.purple)

            Text("نام کاربری: admin")
            Text("ایمیل: admin@example.com")
        }
        .padding()
    }
}
