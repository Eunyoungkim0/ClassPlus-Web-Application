import utils.connectDB;
import java.sql.*;

class CourseUser extends UserSession{
    boolean canWrite = true;

    Connection conn;

    public boolean postOnBoard(String type, String title, String content, String userID){
        try{
            conn = connectDB.getConnection();

            // Construct the SQL query using a PreparedStatement to avoid SQL injection
            String sql = "INSERT INTO users (unccId, lastName, firstName, major, minor, picture, isStudent, isInstructor) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            PreparedStatement preparedStatement = conn.prepareStatement(sql);

            // Set the parameter values for the query
            preparedStatement.setString(2, unccId);
            preparedStatement.setString(3, lastName);
            preparedStatement.setString(4, firstName);
            preparedStatement.setString(6, major);
            preparedStatement.setString(7, minor);
            preparedStatement.setString(8, picture);
            preparedStatement.setBoolean(9, isStudent);
            preparedStatement.setBoolean(10, isInstructor);

            // Execute the SQL query
            int rowsAffected = preparedStatement.executeUpdate();

            if (rowsAffected > 0) {
            System.out.println("Update successful.");
            return true;
            } else {
            System.out.println("Update failed.");
            return false;
            }

        }catch (SQLException e){
            e.printStackTrace();
            return false;
        }
    }
    
}