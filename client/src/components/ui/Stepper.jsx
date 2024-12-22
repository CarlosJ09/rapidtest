function Stepper({ steps = [], currentStep = 0, handleChangeStep = () => {} }) {
  return (
    <>
      <div className="w-full hidden sm:flex justify-between items-center px-1 cursor-pointer gap-x-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex-1 text-center font-bold ${
              index === currentStep ? "text-primary" : "text-secondary"
            }`}
            onClick={() => handleChangeStep(index)}
          >
            <div className={`w-full flex items-center justify-center gap-x-2`}>
              <div
                className={`relative w-8 h-8 flex justify-center items-center rounded-full ${
                  index === currentStep ? "bg-primary" : "bg-secondary"
                } text-white`}
              >
                <p className="absolute text-xs">{index + 1}</p>
              </div>
              <p className="text-xs">{step}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="sm:hidden text-center">
        <p className="text-primary font-bold">{steps[currentStep]}</p>
        {currentStep + 1}/{steps.length}
      </div>
    </>
  );
}

export default Stepper;
