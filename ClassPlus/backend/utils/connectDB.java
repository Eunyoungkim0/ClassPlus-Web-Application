/**
 * Manage server connections
 * 
 */

package utils;
import java.sql.*;

public class connectDB {
    static String url = "jdbc:mysql://sql9.freemysqlhosting.net:3306/sql9654993";
    static String username = "sql9654993"; // Change to your MySQL username
    static String password = "jyG6f1zdxz"; // Change to your MySQL password


    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, username, password);
    }
}
