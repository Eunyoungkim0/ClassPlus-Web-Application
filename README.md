# ClassPlus
## IMPORTANT REMINDERS
  - Place all HTML files in the "public" folder.
  - Store image files in the "images" folder.
  - Keep CSS files in the "css" folder.
  - Store JavaScript files in the "js" folder.
  - The "_old" folder contains code for sprint 2. Do not touch it.
  - The "node_modules" folder is for Node.js. Do not touch it.
  - Outside of these folders, you should only find "server.js", "package.json", and "package-lock.json".
---

### :bell:TO-DO List for Sprint3
  - [ ] Student should be allowed to search for group
  - [ ] Users shall be able to create groups that focus on what they wish to study
  - [ ] Allow students to join study groups 
  - [x] Implement study sets function
  - [ ] Chat feature implemented (X)
  - [ ] Implement location/time booking system
  - [x] Implement a notes/hw sharing feature
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
