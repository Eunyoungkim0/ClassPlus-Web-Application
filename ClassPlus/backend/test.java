/*
		Server: sql9.freemysqlhosting.net
		Name: sql9654993
		Username: sql9654993
		Password: jyG6f1zdxz
		Port number: 3306

		USE sql9654993;

		// TABLE LIST and detail information
		SELECT * 
		  FROM information_schema.TABLES
		 WHERE TABLE_SCHEMA = 'sql9654993';

		// COLUMN LIST and detail information
		 SELECT *
		   FROM information_schema.COLUMNS
		  WHERE TABLE_SCHEMA = 'sql9654993';
		--   AND TABLE_NAME = 'users';
*/
import java.sql.*;
import oracle.jdbc.driver.*; 
import oracle.sql.*;  

public class test {
	public static void main(String[] arg){

		System.out.println("This is test");

		try{  
			//Class.forName("com.mysql.jdbc.Driver");  
			Connection con=DriverManager.getConnection("jdbc:mysql://sql9sql9.freemysqlhosting.net","sql9654993","jyG6f1zdxz");  		
			//here sonoo is database name, root is username and password  
			Statement stmt=con.createStatement();  
			ResultSet rs=stmt.executeQuery("SELECT * FROM USER");  
				while(rs.next())  
					System.out.println(rs.getInt(1)+"  "+rs.getString(2)+"  "+rs.getInt(3));  
					con.close();  
		}catch(Exception e){System.out.println(e);}   
	}
}
