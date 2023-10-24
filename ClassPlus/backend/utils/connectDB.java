/**
 * Manage server connections
 * 
 */

package utils;
import java.sql.*;

public class connectDB {
    static String url = "jdbc:mysql://sql9.freemysqlhosting.net:3306/sql9656322";
    static String username = "sql9656322"; // Change to your MySQL username
    static String password = "7qXDYWB5c3"; // Change to your MySQL password


    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, username, password);
    }
}
