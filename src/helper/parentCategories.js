export const getParentCategories = (categoryId, categories, result = []) => {
     const categoryFind = categories.find((category) => category.id === categoryId);
     if (!categoryFind) {
          return result;
     }
     result.push({ id: categoryFind.id, name: categoryFind.name }); // Thêm danh mục hiện tại vào danh sách

     // Nếu danh mục có cha, tiếp tục đệ quy để lấy danh sách các danh mục cha của cha
     if (categoryFind.parentId !== null) {
          return getParentCategories(categoryFind.parentId, categories, result);
     }
     return result;

}