
(async function getProducts() {
    try {
        $.ajax({
            method: "GET",
            url: "/admin/productPage",
            dataType: "json"
        }).done(function (data) {
            $.each(data, function (i, product) {
                $("#data")

                let cardDiv = document.createElement("div");
                cardDiv.setAttribute("class", "col-12 col-sm-6 col-lg-3 d-flex flex-column align-items-center mb-5")

                let productCard = document.createElement("card");
                productCard.setAttribute("class", "card bg-light mb-3");
                productCard.setAttribute("style", style = "width: 18rem;")
                productCard.setAttribute("id", "cardData");

                let row = document.getElementById("cardRow");
                row.appendChild(cardDiv);
                cardDiv.appendChild(productCard);

                let data = document.getElementById("cardData");

                let productImage = document.createElement("img");
                productImage.setAttribute("class", "card-img-top")
                productImage.setAttribute("src", "../images/product1.jpg");

                productCard.appendChild(productImage)

                let productInfo = document.createElement("ul");
                productInfo.setAttribute("id", "productInfo");
                productInfo.setAttribute("class", "list-group");

                let productName = document.createElement("li")
                productName.setAttribute("class", "list-group-item")
                productName.setAttribute("id", "product-name")

                let productCategory = document.createElement("li");
                productCategory.setAttribute("class", "list-group-item")
                productCategory.setAttribute("id", "product-category");

                let productdescription = document.createElement("li");
                productdescription.setAttribute("class", "list-group-item")
                productdescription.setAttribute("id", "product-description");

                let productPrice = document.createElement("li");
                productPrice.setAttribute("class", "list-group-item")
                productPrice.setAttribute("id", "product-price");

                let salesPrice = document.createElement("li");
                salesPrice.setAttribute("class", "list-group-item")
                salesPrice.setAttribute("id", "sales-price");

                let isActiveOffer = document.createElement("li");
                isActiveOffer.setAttribute("class", "list-group-item")
                isActiveOffer.setAttribute("id", "isActiveOffer");

                let deleteBtn = document.createElement("button")
                deleteBtn.setAttribute("class", "btn btn-danger")
                deleteBtn.setAttribute("id", "deleteBtn")
                deleteBtn.setAttribute("onclick", "deleteProductById('" + product._id + "')")
                deleteBtn.textContent = "Slet produkt"

                let updateBtn = document.createElement("button")
                updateBtn.setAttribute("href", "#")
                updateBtn.setAttribute("class", "btn btn-primary")
                updateBtn.setAttribute("data-toggle", "modal")
                updateBtn.setAttribute("data-target", "#modal")
                updateBtn.setAttribute("onclick", "getProductById('" + product._id + "')")
                updateBtn.textContent = "Opdater produkt"

                productName.textContent = product.name;
                productCategory.textContent = product.category;
                productdescription.textContent = product.description;
                productPrice.textContent = product.price;
                salesPrice.textContent = product.salesPrice;
                isActiveOffer.textContent = product.isActiveOffer;


                productCard.appendChild(productName);
                productCard.appendChild(productCategory);
                productCard.appendChild(productdescription);
                productCard.appendChild(productPrice);
                productCard.appendChild(salesPrice);
                productCard.appendChild(isActiveOffer);
                productCard.appendChild(updateBtn);
                productCard.appendChild(deleteBtn);


            });
        })

    } catch (error) {
        console.log(error);
    }

})();


// Get a project by it's id
function getProductById(id) {
    try {
        console.log(id)
        $.ajax({
            method: "GET",
            url: "/products/" + id,
            dataType: "json"
        }).done(function (product) {

            $("#editName").val(product.name);
            $("#editCategory").val(product.category);
            $("#editDescription").val(product.description);
            $("#editPrice").val(product.price);
            $("#editSalesPrice").val(product.salesPrice);
            $("#editIsActiveOffer").val(product.isActiveOffer);

            $("#updateForm").attr("action", "/products/" + product._id);
        }

        );
    } catch (error) {
        alert("Error")
        console.log(error);
    }
}

// Delete a project by its ID 
function deleteProductById(id) {
    if (confirm("Er du sikker!")) {
        try {
            $.ajax({
                method: "DELETE",
                url: "/admin/products/" + id,
                dataType: "json"
            }).done(

                location.reload()
            );

        } catch (error) {
            alert("Error")
            console.log(error);
        }

    } else {
        console.log("Delete cancelled")
    }
};





// Update a project by it's id
function updateProductById(id) {
    try {
        $.ajax({
            method: "POST",
            url: "/products/" + id,
            dataType: "json"
        }).done()
        location.reload()
    } catch (error) {
        console.log(error);
    }
}




function importData() {
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _ => {
        // you can use this method to get file and perform respective operations
        let files = Array.from(input.files);
        console.log(files);
    };
    input.click();
}

