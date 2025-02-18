import AdminLayout from "../../../../component/Admin/AdminLayout";
import ArticlesList from "../../../../component/Admin/ArticlesData/ArticlesList";

function AllArticles() {
  return (
    <>
      <AdminLayout>
        <ArticlesList />
      </AdminLayout>
    </>
  );
}

export default AllArticles;
