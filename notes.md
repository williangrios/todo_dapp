http alchemy https://eth-goerli.g.alchemy.com/v2/WZMLmoO83vKD1bnHy5BwIUaE91INgAQs


test

const { inputToConfig } = require("@ethereum-waffle/compiler");
const {expect} = require("chai");
const {ethers} = require("hardhat");


describe('Task Contract', function() {
    let TaskContract;
    let taskContract; 
    let owner;

    const NUM_TOTAL_TASKS = 5;
    let totalTasks;

  beforeEach( async function(){
        TaskContract = await ethers.getContractFactory("TaskContract");
        [owner] = await ethers.getSigners();
        taskContract = await TaskContract.deploy();

        totalTasks = [];

        for(let i=0; i < NUM_TOTAL_TASKS; i++){
            let task = {
                'taskText': "Task number :-"+i,
                'isDeleted':false
            };
            await taskContract.addTask(task.taskText,task.isDeleted);
            totalTasks.push(task);

        }

  });


  describe("Add Task",function(){
      it("Should emit AddTask Event",async function(){
            let task = {
                'taskText':'New Task',
                'isDeleted':false,
            };
        await expect(await taskContract.addTask(task.taskText,task.isDeleted)).to.emit(taskContract,"AddTask").withArgs(owner.address,NUM_TOTAL_TASKS);
      });
  });

  describe("Get All tasks",function(){
      it("Should return the correct number of total tasks",async function(){
          const allMyTasks = await taskContract.getMyTasks();
          expect(allMyTasks.length).to.equal(NUM_TOTAL_TASKS);
      });
  });

  describe("Delete Task",function(){
      it("Should emit DeleteTask event",async function(){
          const TASK_ID = 0;
          const TASK_DELETED = true;
          await expect(taskContract.deleteTask(TASK_ID,TASK_DELETED)).to.emit(taskContract,'DeleteTask').withArgs(TASK_ID,TASK_DELETED);
      });
  });



});



deploy
const {ethers} = require("hardhat");


const main = async()=>{
    const contractFactory = await ethers.getContractFactory("TaskContract");
    const contract = await contractFactory.deploy();
    await contract.deployed();
    console.log("Contract deployed to :",contract.address);
}


const runMain = async ()=>{
    try{
        await main();
        process.exit(0);
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}

runMain();

//contract
//0xFe2E68f42cE43E910736Fc606Ea6774513412ac5


contract
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract TaskContract {

    event AddTask(address recipient, uint taskId);
    event DeleteTask(uint taskId, bool isDeleted);

    struct Task{
        uint id;
        string taskText;
        bool isDeleted;
    }

    Task[] private tasks;

    mapping(uint256 => address) taskToOwner;

    function addTask(string memory taskText, bool isDeleted) external{
        uint taskId = tasks.length;
        tasks.push (Task(taskId, taskText, isDeleted));
        taskToOwner[taskId] = msg.sender;
        emit AddTask(msg.sender, taskId);
    }

    function deleteTask(uint taskId, bool isDeleted) external{
        if(taskToOwner[taskId] == msg.sender){
            tasks[taskId].isDeleted = isDeleted;
            emit DeleteTask(taskId, isDeleted);
        }
    }

    function getMyTasks(uint taskId) external view returns (Task[] memory){
        Task[] memory temporary = new Task[](tasks.length);
        uint counter = 0;
        for(uint i =0 ; i<tasks.length;  i++){
            if(taskToOwner[i] == msg.sender && tasks[i].isDeleted == false){
                temporary[counter] = tasks[i];
            }
        }
        Task[] memory result = new Task[](counter);
        for (uint i = 0; i < counter; i++){
            result[i] = temporary [i];
        }
        return result;
    }

}
