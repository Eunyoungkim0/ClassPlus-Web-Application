# ClassPlus
### :bell:TO-DO List for Sprint2
  - [ ] Added a feature that allows users to see what classes other students are enrolled in and to be friends with each other.
  - [ ] All members are granted read access to all sessions. Write permission for sessions related to currently enrolled classes.
  - [x] Implement a table in the database to List and lookup Classes.
  - [ ] Implement profile page and save classes that a user is enrolled in.
  - [ ] When creating an account, make users use only the UNCC email and check if it is a valid email.
---

### :pushpin: Git
  ```
  git init
  git remote add origin git@github.com:cesther31/ClassPlus.git
  git branch -M main
  git push -u origin main
  ```
---

### :gem: Prototype
  ```
  https://www.figma.com/file/YyUiab5Txg146ncSjd7Bn6/Virtual-Study-Group?type=design&node-id=44-349&mode=design&t=9fDjpRKriu4waUT3-0
  ```
---

### :art: Colors
- Primary : charlotte green `#005035`, niner gold `#A49665`, quartz white `#FFFFFF`
- Secondary : jasper `#F1E6B2`, pine green `#899064`, clay red `#802F2D`, sky blue `#007377`, ore black `#101820`
---

### :computer: Database
- Conncetion:
  ```
  Server: classplus.mysql.database.azure.com
  Name: classplus
  Username: classplus
  Password: uncc4155!
  Port number: 3306
  ```
- Database Schema:
  ```
    https://docs.google.com/spreadsheets/d/1qU9fYRAUsLPaQACC979PnMpPOMXpSOPFPisOgn9fzVM/edit#gid=884399397
  ```
- Using mySQL workbench: 
  ```
  USE classplus;

  /* TABLE LIST and detail information */
  SELECT * 
    FROM information_schema.TABLES
   WHERE TABLE_SCHEMA = 'classplus';
 
  /* COLUMN LIST and detail information */
   SELECT *
     FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = 'classplus';
  --   AND TABLE_NAME = 'users';
  ```
---
