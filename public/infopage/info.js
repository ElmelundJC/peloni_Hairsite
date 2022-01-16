(async function getMessages() {
    try {
        $.ajax({
            method: "GET",
            url: "/admin/infoPage",
            dataType: "json"
        }).done(function (data) {

            $.each(data, function (i, messages) {


                if (messages.isActive === "on") {
                    $("#addData")
                        .append(
                            $("<tr> <td>" +
                                messages.title
                                + "</td> <td>" +
                                messages.message
                                // + "</td> <td>" +
                                // messages.isActive
                                // + "</td> <td>" +

                                // "<a href='#' onclick=\"getMessageById('" + messages._id + "')\" data-toggle='modal' data-target='#modal'><span class='fas fa-edit'></span>Opdater</a>"
                                // + "</td> <td>" +
                                // "<a href='#' onclick=\"deleteMessageById('" + messages._id + "')\"><span class='fas fa-trash-alt'></span>Slet</a>"
                                + "</td> </tr>"


                            ))
                }


            });
        })

    } catch (error) {
        console.log(error);
    }

})();