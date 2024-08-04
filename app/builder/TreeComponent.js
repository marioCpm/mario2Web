


import React, { useState,useEffect } from 'react';
import TreeMenu from 'react-simple-tree-menu';
import { Background } from 'reactflow';

const TreeComponent = ({treeData}) => {

  const [parsedTree, setParsedTree] = useState([{key:"0"}]);

    useEffect(() => {
      if (treeData){
        let tree_copy = JSON.parse(JSON.stringify(treeData));

        console.log(JSON.stringify(tree_copy));
        convertLabelsToStringFormat(tree_copy)
        console.log([tree_copy]);
        setParsedTree([tree_copy])
      }
    }, [treeData]);



  function convertLabelsToStringFormat(node) {
    // Check if the node has a label and modify it
    if (node.label) {
      console.log(node.label)
        node.label = `${node.label.task}: "${node.label.estimated_minutes} minutes"`;
    }

    // Recurse through each child node
    if (node.nodes && node.nodes.length > 0) {
        node.nodes.forEach(convertLabelsToStringFormat);
    }
}
  // Function to add child nodes




  // Adding inline styles
  const nodeStyle = {
    padding: '110px',
    border: '21px solid #ccc',
    marginBottom: '115px',
    borderRadius: '5px',
    Background: 'magenta'
  };

  return (
    <div>
      <TreeMenu
        data={parsedTree}
        hasSearch={false}
        debounceTime={125}
        style={nodeStyle}
      />
    </div>
  );
};

export default TreeComponent;
