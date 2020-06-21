# Nodejs MongoDB - Foreign Key Relationships

### Generate Books
| ID  | Title | Authors |
|-----|-------|---------|
| 100 | book1 | [ ]     |
| 200 | book2 | [ ]     |
| 300 | book3 | [ ]     |


### Two way references
- `Author` maintains array of object ids for `books`.
- `Book` maintains array of object ids for `authors`.

### CRUD - CREATE READ UPDATE DELETE

#### Create Author
`{ name: 'author1', books: [ '100', '200' ] }`

| ID | Name    | Books           |
|----|---------|-----------------|
| 10 | author1 | [ '100', '200'] |

| ID  | Title | Authors  |
|-----|-------|----------|
| 100 | book1 | [ '10' ] |
| 200 | book2 | [ '10' ] |
| 300 | book3 | [ ]      |


#### Read Author



#### Update Author

| ID | Name            | Books           |
|----|-----------------|-----------------|
| 10 | author1_updated | [ '300', '200'] |

| ID  | Title | Authors  |
|-----|-------|----------|
| 100 | book1 | [ ]      |
| 200 | book2 | [ '10' ] |
| 300 | book3 | [ '10' ] |

#### Delete Author

| ID | Name | Books |
|----|------|-------|

| ID  | Title | Authors |
|-----|-------|---------|
| 100 | book1 | [ ]     |
| 200 | book2 | [ ]     |
| 300 | book3 | [ ]     |
