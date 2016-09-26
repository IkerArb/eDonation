import {Schemas} from '/lib/collections/schema.js';
import {Blog} from '/lib/collections/blog.js';

Meteor.methods({
  'createBlogPost':function(doc){
    check(doc,Schemas.Blog);
    return Blog.insert(doc,{filter:false,validate:false});
  },
  'deleteBlogPost':function(id){
    Blog.remove(id);
  },
  'updateBlogPost':function(doc,docID){
    check(doc,Schemas.Blog);
    Blog.update(docID,doc,{filter:false,validate:false});
    return docID;
  },
  'pushFileUrlsBlogPost': function(docID,fileParams){
    Blog.update({_id:docID},{$push:{pictures:fileParams}},{filter:false,validate:false});
  },
  'deleteImageBlogPost': function(docID, imagePath){
    Blog.update({_id:docID},{$pull:{pictures:{relative_url:imagePath}}},{filter:false,validate:false});
  }
});
