(async function getMessages() {
    try {
        $.ajax({
            method: "GET",
            url: "/admin/infoPage",
            dataType: "json"
        }).done(function (data) {

            $.each(data, function (i, messages) {

                $("#addData")
                    .append(
                        $("<tr> <td>" +
                            messages.title
                            + "</td> <td>" +
                            messages.message
                            + "</td> <td>" +
                            messages.isActive
                            + "</td> <td>" +

                            "<a href='#' onclick=\"getMessageById('" + messages._id + "')\" data-toggle='modal' data-target='#modal'><span class='fas fa-edit'></span>Opdater</a>"
                            + "</td> <td>" +
                            "<a href='#' onclick=\"deleteMessageById('" + messages._id + "')\"><span class='fas fa-trash-alt'></span>Slet</a>"
                            + "</td> </tr>"


                        ))
            });
        })

    } catch (error) {
        console.log(error);
    }

})();

// Get a service by it's id
function getMessageById(id) {
    try {
        console.log(id)
        $.ajax({
            method: "GET",
            url: "/messages/" + id,
            dataType: "json"
        }).done(function (message) {

            $("#editTitle").val(message.title);
            $("#editMessage").val(message.message);
            $("#editIsActive").val(message.isActive);

            $("#updateForm").attr("action", "/messages/" + message._id);
        }

        );
    } catch (error) {
        alert("Error")
        console.log(error);
    }
}

// Delete a project by its ID 
function deleteMessageById(id) {

    if (confirm("Er du sikker!")) {
        try {
            $.ajax({
                method: "DELETE",
                url: "/admin/message/" + id,
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