const index = (req, res, next) => {
    return res.status(200).json({
        status: "success",
        code: 200,
        message: "Hello World!",
    });
};

const test = (req, res, next) => {
    return res.status(200).json({
        status: "success",
        code: 200,
        message: "Abi ganteng",
    });
};

module.exports = {
    index,
    test,
};
