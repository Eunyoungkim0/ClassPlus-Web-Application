import utils.connectDB;
import java.sql.*;

public class Login {
    private String email;
    private String userPassword;

    private Connection conn;

    public Login(String email, String userPassword){

    }

    public boolean checkEmail(){
        try{
            conn = connectDB.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT count(*) FROM users WHERE email = '" + email + "'");
            if(rs.next()){
                System.out.println("Email does match our record.");
                return true;
            }
            System.out.println("Email does not match our record.");
            return false;
        }catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean checkPassworkd(){
        try{
            conn = connectDB.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT count(*) FROM users WHERE userPassword = '" + userPassword + "'");
            if(rs.next()){
                System.out.println("The password does match our record.");
                return true;
            }
            System.out.println("The password does not match our record.");
            return false;
        }catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}