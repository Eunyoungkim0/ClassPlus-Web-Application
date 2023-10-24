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

    public Signup(String userPassword, String unccId, String lastName, String firstName, String email, String major, String picture, boolean isStudent, boolean isInstructor, Date signupDate){
        this.userPassword = userPassword;
        this.unccId = unccId;
        this.lastName = lastName;
        this.firstName = firstName;
        this.email = email;
        this.major = major;
        this.picture = picture;
        this.isStudent = isStudent;
        this.isInstructor = isInstructor;
        this.signupDate = signupDate;

        if(unccIdExists() && unccEmailExists()){
            register();
        }
    
    }

    /**
     * Return false when the user Id exists
     */
    public boolean unccIdExists(){
        try{
            String unccId_test = "801232989";

            conn = connectDB.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT count(*) FROM users WHERE unccID = '" + unccId_test + "'");
            if(rs.next()){
                System.out.println("This unccId is already Exists.");
                return false;
            }
            System.out.println("This unccId is avaliable.");
            return true;
        }catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
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
        try{
            conn = connectDB.getConnection();

            // Construct the SQL query using a PreparedStatement to avoid SQL injection
            String sql = "INSERT INTO users (userPassword, unccId, lastName, firstName, email, major, minor, picture, isStudent, isInstructor, signupDate) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            PreparedStatement preparedStatement = conn.prepareStatement(sql);

            // Set the parameter values for the query
            preparedStatement.setString(1, userPassword);
            preparedStatement.setString(2, unccId);
            preparedStatement.setString(3, lastName);
            preparedStatement.setString(4, firstName);
            preparedStatement.setString(5, email);
            preparedStatement.setString(6, major);
            preparedStatement.setString(7, minor);
            preparedStatement.setString(8, picture);
            preparedStatement.setBoolean(9, isStudent);
            preparedStatement.setBoolean(10, isInstructor);
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
