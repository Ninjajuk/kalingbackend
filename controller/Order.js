
  
  exports.FetchOrders = async (req, res) => {
    try {
      res.json({name:'Samsuddin Ansari'});
    } catch (error) {
      console.log("server Error");
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  


  // app.post('/addproduct', async (req, resp) => {
  //   try {
  //     console.log('Request received:', req.body);
  //     const { shopName, shopCategory, ownerName, contacts } = req.body;
  //     console.log('Creating new product:', shopName, shopCategory, ownerName, contacts);
  //     const newProduct = new Shop({ shopName, shopCategory, ownerName, contacts });
  //     console.log('New product created:', newProduct);
  //     await newProduct.save();
  //     console.log('Product saved successfully');
  
  //     resp.status(201).json({ message: 'Product added successfully' });
  //   } catch (error) {
  //     console.error('Error adding product:', error);
  //     resp.status(500).json({ error: 'Internal Server Error' });
  //   }
  // });
  
  
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
  
