import utils.connectDB;
import java.sql.*;

public class Friends {
    private String unccID;
    private String picture;
    private boolean isStudent;
    private boolean isInstructor;
    private String lastName;
    private String firstName;
    private String major;
    private String minor;

    private Connection conn;

    public Friends(String unccID){
        this.unccID = unccID;
    }

    public void getInfo(){
        //Query SQL for info
    }
}