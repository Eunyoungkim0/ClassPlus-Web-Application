import utils.connectDB;
import java.sql.*;

public class Session {

    public void addNewUserSession(String email, String userPassword){
        Login login= new Login(email, userPassword);
        if(login.checkEmail() && login.checkPassword()){
            Session user = new UserSession(email);
        }
    }

    public void removeSession(UserSession user){
        user = null;
    }
    
}

class UserSession extends Session{
    private String email;
    private int userId;

    String unccId;
    String lastName;
    String firstName;
    String major;
    String minor;
    String picture;
    boolean isStudent;
    boolean isInstructor;
    boolean isTA;

    private Connection conn;

    public UserSession(String email){
        this.email = email;
        this.userId = setUserId();
        setProfile();
    }

    public void setProfile(){
        this.unccId = setUnccId();
        this.lastName = setLastName();
        this.firstName = setFirstName();
        this.major = setMajor();
        this.minor = setMinor();
        this.picture = setPicture();
        this.isStudent = isStudent();
        this.isInstructor = isInstructor();
        this.isTA = isTA();
    }


    public int setUserId(){
        try {
            conn = connectDB.getConnection();

            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT count(*) FROM users WHERE email = '" + email);

            if (rs.next()) {
                return rs.getInt("userId");
            } else {
                return -1;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return -2;
        }
    }

    public String setUnccId(){
        try {
            conn = connectDB.getConnection();

            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT count(*) FROM users WHERE email = '" + email);

            if (rs.next()) {
                return rs.getString("unccId");
            } else {
                return "unccId not found";
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return "Error retrieving unccId";
        }
    }

    public String setPicture(){
        try {
            conn = connectDB.getConnection();

            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT count(*) FROM users WHERE email = '" + email);

            if (rs.next()) {
                return rs.getString("picture");
            } else {
                return "Picture not found";
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return "Error retrieving Picture";
        }
    }

    public String setFirstName() {
        try {
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT firstName FROM users WHERE email = '" + email + "'");

            if (rs.next()) {
                return rs.getString("firstName");
            } else {
                return "First name not found";
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return "Error retrieving first name";
        }
    }

    public String setLastName() {
        try {
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT lastName FROM users WHERE email = '" + email + "'");

            if (rs.next()) {
                return rs.getString("lastName");
            } else {
                return "Last name not found";
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return "Error retrieving last name";
        }
    }

    public String setMajor() {
        try {
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT major FROM users WHERE email = '" + email + "'");

            if (rs.next()) {
                return rs.getString("major");
            } else {
                return "Major not found";
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return "Error retrieving major";
        }
    }

    public String setMinor() {
        try {
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT minor FROM users WHERE email = '" + email + "'");

            if (rs.next()) {
                return rs.getString("minor");
            } else {
                return "Minor not found";
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return "Error retrieving minor";
        }
    }

    public boolean isStudent() {
        try {
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT isStudent FROM users WHERE email = '" + email + "'");

            if (rs.next()) {
                return rs.getBoolean("isStudent");
            } else {
                return false; // Default to false if not found
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return false; // Default to false on error
        }
    }

    public boolean isInstructor() {
        try {
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT isInstructor FROM users WHERE email = '" + email + "'");

            if (rs.next()) {
                return rs.getBoolean("isInstructor");
            } else {
                return false; // Default to false if not found
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return false; // Default to false on error
        }
    }

    public boolean isTA() {
        try {
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT isTA FROM users WHERE email = '" + email + "'");

            if (rs.next()) {
                return rs.getBoolean("isTA");
            } else {
                return false; // Default to false if not found
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return false; // Default to false on error
        }
    }
}