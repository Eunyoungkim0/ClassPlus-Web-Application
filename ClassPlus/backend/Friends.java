import utils.connectDB;
import java.sql.*;

public class Friends extends UserSession{
    private String email;

    private String unccID;
    private String picture;
    private boolean isStudent;
    private boolean isInstructor;
    private String lastName;
    private String firstName;
    private String major;
    private String minor;

    private Connection conn;

    public Friends(String email){
        this.email = email;
    }
}