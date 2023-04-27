const { find } = require("underscore");

const contentSearch = (data, search) =>
  (data ?? "")
    .toString()
    .toLowerCase()
    .indexOf((search ?? "").toString().toLowerCase()) > -1;
const SystemMessageVSUserMessage = [
  {
    SystemMessage: "Cannot delete or update a parent row: a foreign key constraint fails",
    UserMessage: "Due to its use in another part, the record cannot be deleted or updated.",
  },
];
const errorUserMessage = (err) => {
  return (
    find(SystemMessageVSUserMessage, (f) => contentSearch(err, f.SystemMessage))
      ?.UserMessage ?? err
  );
};

module.exports = { errorUserMessage };
