// Sample Kotlin code for testing
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    
    private lateinit var nameTextView: TextView
    private lateinit var greetButton: Button
    
    private var userName: String = "User"
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        setupUI()
    }
    
    private fun setupUI() {
        nameTextView = findViewById(R.id.nameTextView)
        greetButton = findViewById(R.id.greetButton)
        
        nameTextView.text = "Hello, $userName!"
        greetButton.text = "Greet"
        greetButton.setOnClickListener {
            showGreeting()
        }
    }
    
    private fun showGreeting() {
        AlertDialog.Builder(this)
            .setTitle("Greeting")
            .setMessage("Welcome, $userName!")
            .setPositiveButton("OK") { dialog, _ ->
                dialog.dismiss()
            }
            .show()
    }
}

```swift
import UIKit

// MainActivity corresponds to UIViewController in iOS.
class ViewController: UIViewController {

    // TextView corresponds to UILabel in iOS.
    // In Swift, `lateinit var` is often mapped to implicitly unwrapped optionals (`!`)
    // when the UI elements are guaranteed to be initialized later (e.g., in viewDidLoad or from a Storyboard/XIB).
    private var nameLabel: UILabel
