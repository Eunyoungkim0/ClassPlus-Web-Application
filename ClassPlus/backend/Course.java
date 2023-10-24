import utils.connectDB;
import java.sql.*;

public class Course {
    private int courseId;
    String subject;
    String courseNumber;
    String title;
    String year;
    String semester;

    private Connection conn;

    public Course(String subject, String courseNumber){
        this.subject = subject;
        this.courseNumber = courseNumber;
        this.courseId = setCourseId();
    }

    public void ifUserTakescourse(int userId){
        checkUserTakesCourse(userId);
        CourseUser user = new CourseUser();
    }

    public boolean checkUserTakesCourse(int userId){
        try {
            conn = connectDB.getConnection();

            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT count(*) FROM classesEnrolled WHERE userId = '" + userId + "' AND courseId = '" + courseId + "' AND year = '" + year + "' AND semester = '" + semester + "'");

            if (rs.next()) {
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public int setCourseId(){
        try {
            conn = connectDB.getConnection();

            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT count(*) FROM Courses WHERE subject = '" + subject + "' AND courseNumber = '" + courseNumber + "'");

            if (rs.next()) {
                return rs.getInt("courseId");
            } else {
                return -1;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return -2;
        }
    }
}