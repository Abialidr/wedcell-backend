var BlogsServices = require('../services/BlogServices');

module.exports = {
  CreateBlogs: function (req, res) {
    var data = req.body;
    // const { token, ...data } = req.body;
    //data.Vendor = req.user._id;
    BlogsServices.CreateBlogs(data)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        return res.json(error);
      });
  },

  GetBlogs: function (req, res) {
    const data = req.body;
    let condition = { is_delete: false, vendorId: data._id };

    BlogsServices.GetBlogs(condition)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        console.error(error, '  - - - error = ');
        return res.json(error);
      });
  },
  ///------get_OneItem
  Get_Blogs: function (req, res) {
    const data = req.params;
    let condition = { is_delete: false, _id: data.id };

    BlogsServices.GetBlogs(condition)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        console.error(error, '  - - - error = ');
        return res.json(error);
      });
  },

  GetBlogsAll: (req, res) => {
    const condition = { is_delete: false };

    BlogsServices.GetBlogs(condition)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        console.error(error, '  - - - error = ');
        return res.json(error);
      });
  },

  UpdateBlogs: (req, res) => {
    let data = req.body;
    let condition = {
      _id: req.body._id,
    };
    BlogsServices.UpdateBlogs(condition, data)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        console.error(error, '  - - - error = ');
        return res.json(error);
      });
  },

  DeleteBlogs: function (req, res) {
    let data = {
      is_delete: true,
    };
    let condition = {
      _id: req.body._id,
    };
    BlogsServices.DeleteBlogs(condition, data)
      .then(function (result) {
        BlogsServices.UpdateBlogs(condition, data)
          .then(function (result) {
            return res.json(result);
          })
          .catch(function (error) {
            console.error(error, '  - - - error = ');
            return res.json(error);
          });
      })
      .catch(function (error) {
        console.error(error, '  - - - error = ');
        return res.json(error);
      });
  },

  BlogMainImage: function (req, res) {
    let MainImage = '';
    if (req.files.length > 0) {
      MainImage = 'images/blog/' + req.files[0].filename;
    }
    let condition = {
      _id: req.body._id,
    };
    BlogsServices.UpdateBlogs(condition, { mainImage: MainImage })
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        console.error(error, '  - - - error = ');
        return res.json(error);
      });
  },
};
