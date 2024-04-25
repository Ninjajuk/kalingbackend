const {Product} = require('../model/ProductSchema')

exports.CreateProduct = async (req, resp) => {
    try {
        const data= req.body;
        // const productInstance = new Product(data); //new instance of the Product model
        // await productInstance.save(); // Save the new product instance to the database
        // resp.status(201).json(productInstance); // Send  response with the saved product
 
        if (Array.isArray(data)) {
            // If the request body is an array, insert many products
            const savedProducts = await Product.insertMany(data);
            console.log('Saved array:',savedProducts);
            resp.status(201).json(savedProducts);
        } else {
            // If the request body is a single product, insert one product
            const productInstance = new Product(data);
            const savedProduct = await productInstance.save();
            console.log('Saved product:', savedProduct);
            resp.status(201).json(savedProduct);
        }
     
    } catch (error) {
        resp.status(500).json({ error: 'Server Error please' });
    }
};

exports.FetchallProducts = async (req, res) => {
    try {
        let { skip, limit, search ,all} = req.query;

        // Set default values for skip and limit if not provided
        skip = parseInt(skip) || 0;
        limit = parseInt(limit) || 12;

        let query = {};

        // If search parameter is provided, add it to the query
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query = { name: searchRegex };
        }


                // If 'all' parameter is provided and set to true, fetch all products
                if (all === 'true') {
                    const products = await Product.find(query);
                    res.status(200).json({ products });
                    // console.log(products.length)
                    return; // return early to prevent further execution
                }

// console.log(limit)
// console.log(skip)
        // Find products based on skip and limit
        const products = await Product.find(query)
            .limit(limit)
            .skip(skip); 

        // Check if there are more products
        const totalProductsCount = await Product.countDocuments(query);
        const hasMore = (skip + limit) < totalProductsCount;

        res.status(200).json({ products, hasMore });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: error.message || 'Server Error' });
    }
};


// exports.FetchallProducts = async (req, resp) => {
//     try {
//         let query = {};
//         let { limit,offset, skip, search } = req.query;

//         // If search parameter is provided, construct a regex pattern to match product names
//         if (search) {
//             const searchRegex = new RegExp(search, 'i');
//             query = { name: searchRegex };
//         }

//         // Convert limit and skip to integers
//         limit = parseInt(limit) || 12; // Default to 12 products per request
//         skip = parseInt(skip) || 0;
//         offset = parseInt(offset) || 0; // Change 'skip' to 'offset'

//         // const pro = await Product.find(query).limit(limit).skip(skip);
//         const products = await Product.find(query).limit(limit).skip(offset); // Change 'skip' to 'offset'

//         // Check if there are more products
//         const totalProductsCount = await Product.countDocuments(query);
//         const hasMore = totalProductsCount > offset + limit;

        
//         if (pro.length > 0) {
//             resp.status(200).json({ products, hasMore });
//         } else {
//             resp.status(200).json('No products found. Please add.');
//             // Alternatively, you can return a 404 error if no products found:
//             // resp.status(404).json({ error: 'No products found. Please add.' });
//         }
//     } catch (error) {
//         resp.status(500).json({ error: 'Server Error' });
//     }
// }





//Update Product request
exports.editProduct = async (req, resp) => {
    try {
   
        const { productId } = req.params; // Extract the document ID from the request parameters
        const updatedData = req.body;
        console.log('Product ID:', productId);
        console.log('Updated Data:', updatedData);

        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });

        console.log('Updated Product:', updatedProduct);
        if (!updatedProduct) {
            return resp.status(404).json({ message: 'Product not found' });
          }
      
          resp.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error('Error:', error);
        resp.status(500).json({ error: 'Server Error' });
    }
};

//Delete Product request
exports.removeproduct=async(req,res)=>{
    try {
        const {productId}=req.params
        const delproduct=await Product.findByIdAndDelete(productId)
       
        if (delproduct) {
            res.status(200).json({ message: 'Product deleted successfully.' });
        } else {
            res.status(404).json({ error: 'Product not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user.' });
    }
}
// exports.removeproduct = async (req, res) => {
//     try {
//         const { productId } = req.params;
//         const delproduct = await Product.findByIdAndDelete(productId);

//         if (delproduct) {
//             res.status(200).json({ message: 'Product deleted successfully.' });
//         } else {
//             res.status(404).json({ error: 'Product not found.' });
//         }
//     } catch (error) {
//         console.error('Error deleting product:', error);
//         res.status(500).json({ error: 'Error deleting product.' });
//     }
// };

// Controller function to get products based on category
exports.GetProductsByCategory = async (req, res) => {
    try {
        let { category } = req.params;

          // Normalize category by converting to lowercase and removing leading/trailing spaces
          category = category.toLowerCase().trim();

        const productsInCategory = await Product.find({ category });

        res.status(200).json(productsInCategory);
    } catch (error) {
        console.error('Error retrieving products by category:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Controller function to search products based on a query
exports.SearchProducts = async (req, res) => {
    try {
        const { q } = req.query;

        // Check if the search query has at least 4 characters
        if (!q || q.length < 4) {
            return res.status(400).json({ error: 'Search query should be at least 4 characters long.' });
        }

        const regex = new RegExp(q, 'i'); // Create a case-insensitive regular expression for the search query

        const matchedProducts = await Product.find({
            $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } },
                // Add more fields as needed
            ],
        });

        res.status(200).json(matchedProducts);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

//   app.post('/addproduct', async (req, resp) => {
//     try {
//       console.log('Request received:', req.body);
//       const { title, description, price, cuttedprice,        discount,
//       category,
//       brand,
//       units,
//       stock,
//       rating,
//       highlight1,
//       highlight2,
//       highlight3, } = req.body;
//       console.log('Creating new product:',  title, description, price, cuttedprice,discount,category,brand,units,stock,rating,highlight1,highlight2,highlight3,);
//       const newProduct = new Shop({ title, description, price, cuttedprice,discount,category,brand,units,stock,rating,highlight1,highlight2,highlight3, });
//       console.log('New product created:', newProduct);
//       await newProduct.save();
//       console.log('Product saved successfully');
  
//       resp.status(201).json({ message: 'Product added successfully' });
//     } catch (error) {
//       console.error('Error adding product:', error);
//       resp.status(500).json({ error: 'Internal Server Error' });
//     }
//   });
  
  
  // app.get('/products', async(req,res)=>{
  //   try{
  //     const products = await Shop.find();
  //     res.json(products);
  //   }
  //   catch(error){
  //     console.error('Error fetching users:', error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // })
  
  // // Find data based on id
  // app.get('/findproduct/:id', async (req, res) => {
  //   const { id } = req.params;
  
  //   try {
  //     // Find a product by its ID
  //     const product = await Shop.findBy(id);
  
  //     if (!product) {
  //       return res.status(404).json({ message: 'Product not found' });
  //     }
  
  //     res.json(product);
  //   } catch (error) {
  //     console.error('Error finding product:', error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // });
  
  
  // // Updata Product
  // app.put('/updateproduct/:id', async (req, res) => {
  //   const { id } = req.params; // Extract the document ID from the request parameters
  //   console.log('Updating product with ID:', id);
  
  //   const { shopName, shopCategory, ownerName, contacts } = req.body;
  //   console.log('Update data:', shopName, shopCategory, ownerName, contacts);
  
  //   try {
  //     // Find the document by ID and update its fields
  //     // const updatedProduct = await Shop.findByIdAndUpdate(
  //     //   id,
  //     //   { shopName, shopCategory, ownerName, contacts },
  //     //   { new: true } // Return the updated document
  //     // );
  
  
  //     const updatedProduct = await Shop.findOneAndUpdate(
       
  //     { id, shopName, shopCategory, ownerName, contacts } 
     
  //     );
      
  //     if (!updatedProduct) {
  //       return res.status(404).json({ message: 'Product not found' });
  //     }
  
  //     res.json({ message: 'Product updated successfully', product: updatedProduct });
  //   } catch (error) {
  //     console.error('Error updating product:', error);
  //     res.status(500).json({ error: 'Error updating product', details: error.message });
  //   }
    
  // });
  
  // app.delete('/deleteproduct/:id', async (req, res) => {
  //   const { id } = req.params;
  
  //   try {
  //     const pro = await Shop.findByIdAndDelete(id);
  //     if (!pro) {
  //       return res.status(404).json({ error: 'User not found.' });
  //     }
  //     res.status(200).json({ message: 'User deleted successfully.' });
  //   } catch (error) {
  //     res.status(500).json({ error: 'Error deleting user.' });
  //   }
  // });
  