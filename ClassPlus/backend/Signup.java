import utils.connectDB;
import java.sql.*;

public class Signup {
    private String userPassword;
    private String unccId;
    private String lastName;
    private String firstName;
    private String email;
    private String major;
    private String minor;
    private String picture;
    private boolean isStudent;
    private boolean isInstructor;
    private Date signupDate;
    
    private Connection conn;

    public Signup(String userPassword, String email){
        this.userPassword = userPassword;
        this.email = email;
    }

    /**
     * Return false when the uncc email exists
     */
    public boolean unccEmailExists(){
        try{
            conn = connectDB.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT count(*) FROM users WHERE unccID = '" + email + "'");
            if(rs.next()){
                System.out.println("This email is already Exists.");
                return false;
            }
            System.out.println("This email is avaliable.");
            return true;
        }catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean register(){
        if(!unccEmailExists()){
            return false;
        }
        try{
            conn = connectDB.getConnection();

            // Construct the SQL query using a PreparedStatement to avoid SQL injection
            String sql = "INSERT INTO users (userPassword, email, signupDate) " +
            "VALUES (?, ?, ?)";

            PreparedStatement preparedStatement = conn.prepareStatement(sql);

            // Set the parameter values for the query
            preparedStatement.setString(1, userPassword);
            preparedStatement.setString(5, email);
            preparedStatement.setDate(11, signupDate);

            // Execute the SQL query
            int rowsAffected = preparedStatement.executeUpdate();

            if (rowsAffected > 0) {
            System.out.println("Registration successful.");
            return true;
            } else {
            System.out.println("Registration failed.");
            return false;
            }

        }catch (SQLException e){
            e.printStackTrace();
            return false;
        }
    }
}
