/**
 * Manage server connections
 * 
 */

package utils;
import java.sql.*;

public class connectDB {
    static String url = "jdbc:mysql://classplus.mysql.database.azure.com:3306/classplus";
    static String username = "classplus"; // Change to your MySQL username
    static String password = "uncc4155!"; // Change to your MySQL password


    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, username, password);
    }
}
