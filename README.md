# ClassPlus

### :bell:TO-DO List for Sprint4
  - [x] Allow read and write to class sessions for instructor members 
  - [x] TA should be able to join any group under the same course they are working with
  - [ ] Moderators should be able to remove posts/study sets/groups from the list.
  - [x] Moderators should be able to block anyone.
  - [ ] Implement an onboarding tutorial screen to guide new users of website features.
---

### :pushpin: Git Command
  ```
  git init
  git remote add origin git@github.com:cesther31/ClassPlus.git
  git branch -M main
  git push -u origin main
  ```
---

### :gem: Prototype & User Stories & Slides for presentation
  ```
  (Prototype)
  https://www.figma.com/file/YyUiab5Txg146ncSjd7Bn6/Virtual-Study-Group?type=design&node-id=44-349&mode=design&t=9fDjpRKriu4waUT3-0
  ```
  ```
  (User Stories Sheets)
  https://docs.google.com/spreadsheets/d/1ebKxKzXhA_JxpYLkRaB3GCXKsxjk7sJj5OP9STSA-Mk/edit#gid=1825128867
  ```
  ```
  (Slides for presentation)
  https://docs.google.com/presentation/d/1KdKrPP2dJeRoD9IWADPYUdwhJlTAghQjdW6YU4kxrjA/edit#slide=id.p
  ```
---

### :art: Colors
- Primary : charlotte green `#005035`, niner gold `#A49665`, quartz white `#FFFFFF`
- Secondary : jasper `#F1E6B2`, pine green `#899064`, clay red `#802F2D`, sky blue `#007377`, ore black `#101820`
---

### :computer: Database - MySQL
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
