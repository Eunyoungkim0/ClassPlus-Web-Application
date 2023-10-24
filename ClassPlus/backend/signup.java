import utils.connectDB;
import java.sql.*;

public class signup {
    private String userPwd;
    private int unccId;
    private String lastN;
    private String firstN;
    private String email;
    private String major;
    private String minor;
    private String picture;
    private boolean isStudent;
    private boolean isInst;
    private boolean isTA;
    private Date signupDate;
    
    private Connection conn;

    public signup(){
    }

    /**
     * Return false when the user Id exists
     */
    public boolean unccIdExists(){
        try{
            int unccId = 801232989;

            conn = connectDB.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM users");
            while (rs.next()) {
                int uid = rs.getInt("unccId");
                if(uid == unccId){
                    System.out.println("This unccId is already Exists.");
                    return false;
                }
            }
            System.out.println("This unccId is avaliable.");
            return true;
        }catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Return false when the uncc Id exists
     */
}
