// Sample Swift code for testing
class ViewController: UIViewController {
    
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var greetButton: UIButton!
    
    var userName: String = "User"
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    func setupUI() {
        nameLabel.text = "Hello, \(userName)!"
        greetButton.setTitle("Greet", for: .normal)
        greetButton.addTarget(self, action: #selector(greetButtonTapped), for: .touchUpInside)
    }
    
    @objc func greetButtonTapped() {
        let alert = UIAlertController(title: "Greeting", message: "Welcome, \(userName)!", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        present(alert, animated: true, completion: nil)
    }
}
